import { DateTime } from "ionic-angular/components/datetime/datetime";

export class ItemModel {
    done: boolean;
    id: string;
    name: string;
    quantity: number;
    category: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}