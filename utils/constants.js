const PERMISSIONS = {
    create : 'create',
    read : 'read',
    update : 'update',
    delete : 'delete'
}

const EXTENSION_TYPES = {
    wordAndTxt : [
        '.wpd',
        '.txt',
        '.tex',
        '.rtf',
        '.pdf',
        '.odt',
        '.doc',
        '.docx'
    ],
    spreadSheet: [
        '.xlsx',
        '.xlsm',
        '.xls',
        '.ods'
    ],
    presentation : [
        '.key',
        '.pptx',
        '.ppt',
        '.pps',
        '.odp'
    ],
    image : [
        '.ai',
        '.bmp',
        '.gif',
        '.ico',
        '.jpeg',
        '.jpg',
        '.png',
        '.ps',
        '.psd',
        '.svg',
        '.tif',
        '.tiff'
    ],
    audio : [
        '.aif',
        '.cda',
        '.mid',
        '.midi',
        '.mp3',
        '.mpa',
        '.ogg',
        '.wav',
        '.wma',
        '.wpl'
    ],
    video : [
        '.3g2',
        '.3gp',
        '.avi',
        '.flv',
        '.h264',
        '.m4v',
        '.mkv',
        '.mov',
        '.mp4',
        '.mpg',
        '.mpeg',
        '.rm',
        '.swf',
        '.vob',
        '.wmv'
    ]
}

module.exports = {
    PERMISSIONS,
    EXTENSION_TYPES
}