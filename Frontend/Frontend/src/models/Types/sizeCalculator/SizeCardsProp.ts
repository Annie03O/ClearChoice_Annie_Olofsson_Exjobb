import type { Category } from "./Category";

export type SizeCardsProps = {
    title?: string;
    size: Category;
    precision?: number;
    showUnits?: boolean;
}