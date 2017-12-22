import { DateTime } from "ionic-angular/components/datetime/datetime";

export class CategoryModel {
    id: string;
    name: string;
    createdAt: DateTime;
    items: string;
    updatedAt: DateTime;
}