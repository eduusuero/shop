import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interfaces';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, Observable, of, pipe, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?:  number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
};

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string,ProductsResponse>();

  private productCache = new Map<string,Product>();

  getProducts(options: Options): Observable<ProductsResponse>{

    //Desestructuro el argumento
    const { limit = 9, offset = 0, gender = '' } = options;

    //CON ESTE CONSOLE LOG VEO COMO GUARDA EL HASH EN CACHE
    //console.log(this.productsCache.entries());

    //String concatenado con los argumentos 9-0-''
    const key = `${limit}-${offset}-${gender}`;

    //Si existe el hash, entonces ya fue cargado
    if( this.productsCache.has(key)){

      return of( this.productsCache.get(key)!);
    }


    return this.http.get<ProductsResponse>(`${baseUrl}/products`, { params: {limit,offset,gender} })
    .pipe(
      tap( resp => console.log(resp)),
      tap( resp => this.productsCache.set(key, resp)),
    );
  }

  getProductByIdSlug( idSlug: string ): Observable<Product>{

    //Mi key sera el idSlug
    const key = idSlug;

    if( this.productCache.has(key)){

      return of( this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${ idSlug }`)
    .pipe(
      delay(1000), //ESTE ES PARA VERIFICAR EN PANTALLA CUANDO CARGA Y CUANDO LO TIENE EN CACHE
      tap( product => this.productCache.set(idSlug, product)),
    )
  }

  getProductById( id: string ): Observable<Product>{

    if( id === 'new' ){
      return of(emptyProduct);
    }


    if( this.productCache.has(id)){

      return of( this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${ id }`)
    .pipe(
      delay(1000), //ESTE ES PARA VERIFICAR EN PANTALLA CUANDO CARGA Y CUANDO LO TIENE EN CACHE
      tap( product => this.productCache.set(id, product)),
    )
  }

  updateProduct( id: string , productLike: Partial<Product>): Observable<Product>{
    console.log('Actualizando producto')

    return this.http.patch<Product>(`${ baseUrl }/products/${ id }`, productLike )
    .pipe(
      tap( (product ) => this.updateProductCache(product) )
    );
  }

    createProduct( productLike: Partial<Product>): Observable<Product>{

    return this.http.post<Product>(`${ baseUrl }/products`,productLike)
    .pipe(
      tap( (product ) => this.updateProductCache(product) )
    );
  }

  updateProductCache(product: Product){

    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach( productResponse => {

      productResponse.products = productResponse.products.map( (currentProduct =>{
         return currentProduct.id === productId ? product : currentProduct;
      }))

    } )

    console.log('Cache actualizado');
  }



}
