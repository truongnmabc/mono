import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function ctx(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
