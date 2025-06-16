
export const ValleyColors = [
    "#D89E1D",
    "#47BF6F",
    "#FF6F68",
    "#F2C94C",
]

export const ValleyColorsHover = [
    "#FF6058",
    "#10B747",
    "#BA8100",
    "#F3C435",
]

export const CommunicationsColors = [
    "#68d100", // INTERNA
    "#D10068", // EXTERNA
    "#850042", // ASUNTOS PÚBLICOS
    "#0068D1", // TRANSVERSAL  
]

export const CommunicationsColorsHover = [
    "#68d100", // INTERNA
    "#D10068", // EXTERNA
    "#7A2D3C", // ASUNTOS PÚBLICOS
    "#0068D1", // TRANSVERSAL
]

export const AllColors = [
    ...ValleyColors.filter(color => color !== "#F2C94C"), 
    ...CommunicationsColors,
];