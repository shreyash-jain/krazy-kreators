/**
 * Two Column Layout Tool for EditorJS
 * Allows creating side-by-side content with rich text editing in blog posts
 */

export default class TwoColumnTool {
    private api: any;
    private readOnly: boolean;
    private data: { leftContent: string; rightContent: string };
    private wrapper: HTMLElement | null;
    private leftEditor: HTMLDivElement | null;
    private rightEditor: HTMLDivElement | null;

    static get toolbox() {
        return {
            title: 'Two Columns',
            icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="7" height="15" fill="currentColor"/><rect x="10" y="0" width="7" height="15" fill="currentColor"/></svg>',
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, api, readOnly }: any) {
        this.api = api;
        this.readOnly = readOnly;
        this.data = {
            leftContent: data.leftContent || '',
            rightContent: data.rightContent || '',
        };
        this.wrapper = null;
        this.leftEditor = null;
        this.rightEditor = null;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('two-column-tool');

        const container = document.createElement('div');
        container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; background: #fafafa;';

        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'border-right: 2px solid #e5e7eb; padding-right: 1rem;';

        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'padding-left: 1rem;';

        if (this.readOnly) {
            leftColumn.innerHTML = this.data.leftContent;
            rightColumn.innerHTML = this.data.rightContent;
        } else {
            // Left column editor
            const leftLabel = document.createElement('div');
            leftLabel.textContent = 'Left Column';
            leftLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem;';

            const leftToolbar = this.createToolbar('left');
            this.leftEditor = this.createEditor(this.data.leftContent);

            leftColumn.appendChild(leftLabel);
            leftColumn.appendChild(leftToolbar);
            leftColumn.appendChild(this.leftEditor);

            // Right column editor
            const rightLabel = document.createElement('div');
            rightLabel.textContent = 'Right Column';
            rightLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem;';

            const rightToolbar = this.createToolbar('right');
            this.rightEditor = this.createEditor(this.data.rightContent);

            rightColumn.appendChild(rightLabel);
            rightColumn.appendChild(rightToolbar);
            rightColumn.appendChild(this.rightEditor);
        }

        container.appendChild(leftColumn);
        container.appendChild(rightColumn);
        this.wrapper.appendChild(container);

        return this.wrapper;
    }

    createToolbar(side: 'left' | 'right'): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = 'display: flex; gap: 0.25rem; margin-bottom: 0.5rem; padding: 0.25rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem;';

        const buttons = [
            { cmd: 'bold', icon: '<b>B</b>', title: 'Bold' },
            { cmd: 'italic', icon: '<i>I</i>', title: 'Italic' },
            { cmd: 'underline', icon: '<u>U</u>', title: 'Underline' },
            { cmd: 'insertUnorderedList', icon: '• List', title: 'Bullet List' },
            { cmd: 'insertOrderedList', icon: '1. List', title: 'Numbered List' },
            { cmd: 'createLink', icon: '🔗', title: 'Insert Link' },
            { cmd: 'insertImage', icon: '🖼️', title: 'Insert Image' },
        ];

        buttons.forEach(({ cmd, icon, title }) => {
            const btn = document.createElement('button');
            btn.innerHTML = icon;
            btn.title = title;
            btn.type = 'button';
            btn.style.cssText = 'padding: 0.25rem 0.5rem; border: none; background: transparent; cursor: pointer; border-radius: 0.25rem; font-size: 12px; transition: background 0.2s;';
            btn.onmouseover = () => btn.style.background = '#f3f4f6';
            btn.onmouseout = () => btn.style.background = 'transparent';

            btn.onclick = (e) => {
                e.preventDefault();
                const editor = side === 'left' ? this.leftEditor : this.rightEditor;
                if (!editor) return;

                editor.focus();

                if (cmd === 'createLink') {
                    const url = prompt('Enter URL:');
                    if (url) document.execCommand(cmd, false, url);
                } else if (cmd === 'insertImage') {
                    const url = prompt('Enter image URL:');
                    if (url) {
                        document.execCommand(cmd, false, url);
                    }
                } else {
                    document.execCommand(cmd, false);
                }

                this.updateData(side);
            };

            toolbar.appendChild(btn);
        });

        return toolbar;
    }

    createEditor(content: string): HTMLDivElement {
        const editor = document.createElement('div');
        editor.contentEditable = 'true';
        editor.innerHTML = content;
        editor.style.cssText = 'min-height: 150px; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; font-family: inherit; outline: none; overflow-y: auto; max-height: 400px;';

        editor.addEventListener('focus', () => {
            editor.style.borderColor = '#3b82f6';
            editor.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });

        editor.addEventListener('blur', () => {
            editor.style.borderColor = '#d1d5db';
            editor.style.boxShadow = 'none';
        });

        editor.addEventListener('input', () => {
            const side = editor === this.leftEditor ? 'left' : 'right';
            this.updateData(side);
        });

        // Handle paste to clean up formatting
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData?.getData('text/html') || e.clipboardData?.getData('text/plain') || '';
            document.execCommand('insertHTML', false, text);
        });

        return editor;
    }

    updateData(side: 'left' | 'right') {
        if (side === 'left' && this.leftEditor) {
            this.data.leftContent = this.leftEditor.innerHTML;
        } else if (side === 'right' && this.rightEditor) {
            this.data.rightContent = this.rightEditor.innerHTML;
        }
    }

    save() {
        // Ensure we capture the latest content
        if (this.leftEditor) {
            this.data.leftContent = this.leftEditor.innerHTML;
        }
        if (this.rightEditor) {
            this.data.rightContent = this.rightEditor.innerHTML;
        }

        return {
            leftContent: this.data.leftContent,
            rightContent: this.data.rightContent,
        };
    }

    validate(savedData: any) {
        return savedData.leftContent || savedData.rightContent;
    }
}
