
import { Editor } from 'grapesjs';

export const registerBlocks = (editor: Editor) => {
    const bm = editor.BlockManager;

    // 1. Structure
    bm.add('mj-section', {
        label: 'Section',
        category: 'Structure',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<mj-section padding="20px" background-color="#ffffff">
                <mj-column>
                  <mj-text>Section Content</mj-text>
                </mj-column>
              </mj-section>`
    });

    bm.add('mj-1-column', {
        label: '1 Column',
        category: 'Structure',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<mj-section>
                <mj-column width="100%">
                  <mj-text>One Column</mj-text>
                </mj-column>
              </mj-section>`
    });

    bm.add('mj-2-columns', {
        label: '2 Columns',
        category: 'Structure',
        attributes: { class: 'gjs-fonts gjs-f-b2' },
        content: `<mj-section>
                <mj-column width="50%"><mj-text>Col 1</mj-text></mj-column>
                <mj-column width="50%"><mj-text>Col 2</mj-text></mj-column>
              </mj-section>`
    });

    bm.add('mj-3-columns', {
        label: '3 Columns',
        category: 'Structure',
        attributes: { class: 'gjs-fonts gjs-f-b3' },
        content: `<mj-section>
                <mj-column width="33.33%"><mj-text>Col 1</mj-text></mj-column>
                <mj-column width="33.33%"><mj-text>Col 2</mj-text></mj-column>
                <mj-column width="33.33%"><mj-text>Col 3</mj-text></mj-column>
              </mj-section>`
    });

    // 2. Content
    bm.add('mj-text', {
        label: 'Text',
        category: 'Content',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: '<mj-text font-size="16px" color="#000000" font-family="Arial">Insert text here</mj-text>'
    });

    bm.add('mj-image', {
        label: 'Image',
        category: 'Content',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        content: '<mj-image src="https://via.placeholder.com/350x150" alt="Placeholder image" align="center" />'
    });

    bm.add('mj-button', {
        label: 'Button',
        category: 'Content',
        attributes: { class: 'gjs-fonts gjs-f-button' },
        content: '<mj-button background-color="#414141" color="#ffffff" href="#">Button</mj-button>'
    });

    bm.add('mj-divider', {
        label: 'Divider',
        category: 'Content',
        attributes: { class: 'gjs-fonts gjs-f-divider' },
        content: '<mj-divider border-color="#F45E43" />'
    });

    bm.add('mj-social', {
        label: 'Social Group',
        category: 'Content',
        attributes: { class: 'fa fa-share-alt' },
        content: `<mj-social font-size="15px" icon-size="30px" mode="horizontal">
                <mj-social-element name="facebook" href="https://mjml.io/">
                  Facebook
                </mj-social-element>
                <mj-social-element name="google" href="https://mjml.io/">
                  Google
                </mj-social-element>
                <mj-social-element name="twitter" href="https://mjml.io/">
                  Twitter
                </mj-social-element>
              </mj-social>`
    });

    bm.add('mj-hero', {
        label: 'Hero',
        category: 'Content',
        attributes: { class: 'fa fa-image' },
        content: `<mj-hero
                  mode="fixed-height"
                  height="469px"
                  background-width="600px"
                  background-height="469px"
                  background-url="https://cloud.githubusercontent.com/assets/1830348/15354890/1442159a-1cf0-11e6-92b1-b861dadf1750.jpg"
                  background-color="#2a3448"
                  padding="100px 0px">
                  <mj-text
                    padding="20px"
                    color="#ffffff"
                    font-family="Helvetica"
                    align="center"
                    font-size="45px"
                    line-height="45px"
                    font-weight="900">
                    GO TO SPACE
                  </mj-text>
                  <mj-button href="https://mjml.io/" align="center">
                    ORDER YOUR TICKET NOW
                  </mj-button>
                </mj-hero>`
    });
};
