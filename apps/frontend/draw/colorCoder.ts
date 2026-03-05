const tailwindColors: Record<string, string> = {
    "red-500": "rgb(239, 68, 68)",
    "blue-500": "rgb(59, 130, 246)",
    "green-500": "rgb(34, 197, 94)",
    "white": "rgb(255, 255, 255)"
};

export function colorCoder(tailwindColor: string, alpha: number = 1): string {
    const rgb = tailwindColors[tailwindColor] || "rgb(0, 0, 0)";  // Default to black if not found
    return rgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);
}