import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { Product } from "./product.model";

const products = [
  { title: "Harry Potter", price: 10.99 },
  { title: "Lord of the Rings", price: 12.99 }
];

const loadedProducts = plainToClass(Product, products);

for (const product of loadedProducts) {
  console.log(product.getInformation());
}

const newProd = new Product("", -6.99);
validate(newProd).then(errors => {
  if (errors.length) {
    console.error("Validation errors");
    console.log(errors);
  } else {
    console.log(newProd.getInformation());
  }
});
