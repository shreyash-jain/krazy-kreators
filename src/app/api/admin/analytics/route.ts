import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const email = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!propertyId || !email || !privateKey) {
      return NextResponse.json({ error: 'Missing GA credentials' }, { status: 500 });
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
    });

    // Run parallel reports
    const [trendReport, pagesReport, geoReport, trafficReport, deviceReport] = await Promise.all([
      // 1. Trend Report (Last 30 days)
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
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
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
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
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),
      
      // 4. Traffic Sources Report
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),

      // 5. Device Category Report
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      })
    ]);

    // Process Trend Data
    const rows = trendReport[0].rows?.map(row => ({
      date: row.dimensionValues?.[0].value, // YYYYMMDD
      activeUsers: parseInt(row.metricValues?.[0].value || '0'),
      screenPageViews: parseInt(row.metricValues?.[1].value || '0'),
      sessions: parseInt(row.metricValues?.[2].value || '0'),
      newUsers: parseInt(row.metricValues?.[3].value || '0'),
      avgSessionDuration: parseFloat(row.metricValues?.[4].value || '0'),
      engagementRate: parseFloat(row.metricValues?.[5].value || '0'),
    })) || [];

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
    const pages = pagesReport[0].rows?.map(row => ({
      path: row.dimensionValues?.[0].value,
      title: row.dimensionValues?.[1].value,
      views: parseInt(row.metricValues?.[0].value || '0'),
      users: parseInt(row.metricValues?.[1].value || '0'),
      avgDuration: parseFloat(row.metricValues?.[2].value || '0'),
    })) || [];

    // Process Countries Data
    const countries = geoReport[0].rows?.map(row => ({
      country: row.dimensionValues?.[0].value,
      users: parseInt(row.metricValues?.[0].value || '0'),
    })) || [];

    // Process Traffic Data
    const trafficSources = trafficReport[0].rows?.map(row => ({
      channel: row.dimensionValues?.[0].value,
      users: parseInt(row.metricValues?.[0].value || '0'),
    })) || [];

    // Process Device Data
    const devices = deviceReport[0].rows?.map(row => ({
      device: row.dimensionValues?.[0].value, // desktop, mobile, tablet
      users: parseInt(row.metricValues?.[0].value || '0'),
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
