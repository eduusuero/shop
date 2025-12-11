import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';


@Component({
  selector: 'product-details',
  imports: [ProductCarousel,ReactiveFormsModule],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit{


  product = input.required<Product>();

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS','S','M','L','XL','XLL'];

    ngOnInit(): void {
      this.setFormValue(this.product());
  }

  setFormValue( formLike: Partial<Product> ){
    this.productForm.reset( this.product() as any)
    //this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',')});
  }

  onSizeCliked( size: string ){

    //Obtengo todas las tallas de ese producto.
    const currentSizes = this.productForm.value.sizes ?? [];

    //Si la talla ya esta incluida es xq presiono para sacarla
    if( currentSizes.includes(size)){

      currentSizes.splice( currentSizes.indexOf(size), 1 );
    }
    //Si no existe, lo agregamos
    else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({sizes: currentSizes });
  }


  onSubmit(){
    console.log(this.productForm.value);
  }
 }
