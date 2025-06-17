
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
    "#6188B4", // INTERNA
    "#AC5AAC", // EXTERNA
    "#41A79B", // ASUNTOS PÚBLICOS
    "#0068D1", // TRANSVERSAL  
]

export const CommunicationsColorsHover = [
    "#6188B4", // INTERNA
    "#AC5AAC", // EXTERNA
    "#41A79B", // ASUNTOS PÚBLICOS
    "#0068D1", // TRANSVERSAL
]

export const AllColors = [
    ...ValleyColors.filter(color => color !== "#F2C94C"), 
    ...CommunicationsColors,
];