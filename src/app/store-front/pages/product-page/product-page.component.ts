import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [
    ProductCarousel,
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  //Esto es para obtener la ruta del idSlug
  activatedRoute = inject(ActivatedRoute);

  productService = inject(ProductsService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug}),
    loader: ({ request }) => {
      return this.productService.getProductByIdSlug(request.idSlug);
    },
  });
 }
