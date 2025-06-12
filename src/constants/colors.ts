
export const ValleyColors = [
    "#FF6F68",
    "#47BF6F",
    "#D89E1D",
    "#F2C94C",
]

export const ValleyColorsHover = [
    "#FF6058",
    "#10B747",
    "#BA8100",
    "#F3C435",
]

export const CommunicationsColors = [
    "#5489B8", // INTERNA
    "#B854B1", // EXTERNA
    "#B85468", // ASUNTOS PÚBLICOS
    "#F2C94C", // TRANSVERSAL  
]

export const CommunicationsColorsHover = [
    "#2D5F7A", // INTERNA
    "#7A2D7A", // EXTERNA
    "#7A2D3C", // ASUNTOS PÚBLICOS
    "#F3C435", // TRANSVERSAL
]

export const AllColors = [
    ...ValleyColors.filter(color => color !== "#F2C94C"), // Exclude TRANSVERSAL from ValleyColors
    ...CommunicationsColors,
];