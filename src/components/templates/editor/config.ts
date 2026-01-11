
export const storageManagerConfig = {
    type: 'local',
    autosave: true,
    autoload: true,
    stepsBeforeSave: 1,
};

export const blockManagerConfig = {
    appendTo: '#blocks-container',
};

export const layerManagerConfig = {
    appendTo: '#layers-container',
};

export const traitManagerConfig = {
    appendTo: '#traits-container',
};

export const deviceManagerConfig = {
    devices: [
        { id: 'desktop', name: 'Desktop', width: '' },
        { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
        { id: 'mobile', name: 'Mobile', width: '320px', widthMedia: '480px' },
    ]
};

export const styleManagerConfig = {
    appendTo: '#styles-container',
    sectors: [
        {
            name: 'Typography',
            open: true,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration'],
            properties: [
                { name: 'Font', property: 'font-family' },
                { name: 'Size', property: 'font-size' },
                { name: 'Weight', property: 'font-weight' },
                { name: 'Color', property: 'color', type: 'color' },
            ]
        },
        {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border', 'border-radius'],
            properties: [
                { name: 'Background', property: 'background-color', type: 'color' },
            ]
        },
        {
            name: 'Dimensions',
            open: false,
            buildProps: ['width', 'height', 'padding', 'margin'],
        }
    ],
};
