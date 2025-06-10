
export const ValleyColors = [
    "#B0A3CC",
    "#54B87E",
    "#EFA585",
    "#F2C94C",
]

export const ValleyColorsHover = [
    "#573B92",
    "#2D7A4D",
    "#E66C37",
    "#EFD689",
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
    "#EFD689", // TRANSVERSAL
]

export const AllColors = [
    ...ValleyColors.filter(color => color !== "#F2C94C"), // Exclude TRANSVERSAL from ValleyColors
    ...CommunicationsColors,
];