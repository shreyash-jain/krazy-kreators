import { NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

async function getAccessToken(email: string, privateKey: string) {
  try {
    const pk = await jose.importPKCS8(privateKey, 'RS256');
    const jwt = await new jose.SignJWT({
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(email)
      .setSubject(email)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(pk);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error('Error getting access token:', err);
    throw err;
  }
}

interface GARow {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

async function runReport(accessToken: string, propertyId: string, requestBody: unknown) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GA4 API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const email = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!propertyId || !email || !privateKey) {
      return NextResponse.json({ error: 'Missing GA credentials' }, { status: 500 });
    }

    const accessToken = await getAccessToken(email, privateKey);

    // Run parallel reports
    const [trendReport, pagesReport, geoReport, trafficReport, deviceReport] = await Promise.all([
      // 1. Trend Report (Last 30 days)
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'averageSessionDuration' },
          { name: 'engagementRate' }
        ],
        orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }],
      }),

      // 2. Pages Report (Top 20 Pages)
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' }
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' }
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20,
      }),

      // 3. Geo/Device Report (Simple top countries)
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),
      
      // 4. Traffic Sources Report
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),

      // 5. Device Category Report
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      })
    ]);

    // Process Trend Data
    const rows = (trendReport.rows as GARow[] | undefined)?.map((row) => ({
      date: row.dimensionValues?.[0]?.value, // YYYYMMDD
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
      screenPageViews: parseInt(row.metricValues?.[1]?.value || '0'),
      sessions: parseInt(row.metricValues?.[2]?.value || '0'),
      newUsers: parseInt(row.metricValues?.[3]?.value || '0'),
      avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[5]?.value || '0'),
    })) || [];

    /**eslint-disable-next-line */
    // Calculate Totals

    const totals = {
      activeUsers: rows.reduce((acc, curr) => acc + curr.activeUsers, 0),
      screenPageViews: rows.reduce((acc, curr) => acc + curr.screenPageViews, 0),
      sessions: rows.reduce((acc, curr) => acc + curr.sessions, 0),
      newUsers: rows.reduce((acc, curr) => acc + curr.newUsers, 0),
      avgEngagementRate: (rows.reduce((acc, curr) => acc + curr.engagementRate, 0) / (rows.length || 1)),
      avgSessionDuration: (rows.reduce((acc, curr) => acc + curr.avgSessionDuration, 0) / (rows.length || 1)),
    };

    // Process Pages Data
    const pages = (pagesReport.rows as GARow[] | undefined)?.map((row) => ({
      path: row.dimensionValues?.[0]?.value,
      title: row.dimensionValues?.[1]?.value,
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Process Countries Data
    const countries = (geoReport.rows as GARow[] | undefined)?.map((row) => ({
      country: row.dimensionValues?.[0]?.value,
      users: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Process Traffic Data
    const trafficSources = (trafficReport.rows as GARow[] | undefined)?.map((row) => ({
      channel: row.dimensionValues?.[0]?.value,
      users: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Process Device Data
    const devices = (deviceReport.rows as GARow[] | undefined)?.map((row) => ({
      device: row.dimensionValues?.[0]?.value, // desktop, mobile, tablet
      users: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    return NextResponse.json({
      overview: { rows, totals },
      pages,
      countries,
      trafficSources,
      devices
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
