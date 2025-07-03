export const ValleyColors = [
    "#D89E1D",
    "#47BF6F",
    "#FF6F68",
    "#F2C94C",
]

export const SecondaryValleyColors = [
    "#bc8100",
    "#0e7c00",
    "#8e0700"
]

export const ValleyColorsHover = [
    "#BA8100",
    "#10B747",
    "#FF6058",
    "#F3C435",
]

export const CommunicationsColors = [
    "#6188B4", // INTERNA
    "#AC5AAC", // EXTERNA
    "#41A79B", // ASUNTOS PÚBLICOS
    "#0068D1", // TRANSVERSAL  
]

export const SecondaryCommunicationsColors = [
    "#253B52", // INTERNA (más oscuro)
    "#4B234B", // EXTERNA (más oscuro)
    "#18443D", // ASUNTOS PÚBLICOS (más oscuro)
    "#002147" // TRANSVERSAL (más oscuro)
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