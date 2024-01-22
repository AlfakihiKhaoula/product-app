import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  //products$! :Observable<Array<Product>>;
  products : Array<Product> = [];
   public keyword : string ="";
   totalPages:number=0;
   pageSize:number=3;
   currentPage:number=1;

  constructor(private productService : ProductService, private router:Router) {
  }
  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    this.productService.getProducts(this.currentPage,this.pageSize)
      .subscribe({
      next : (resp) =>{
        this.products = resp.body as Product[];
        let  totalProducts :number = parseInt(resp.headers.get(' x-total-count')!);
        this.totalPages =Math.floor(totalProducts / this.pageSize) ;
        if(totalProducts % this.pageSize !=0){
          this.totalPages=this.totalPages+1;
        }
      },
      error : err => {
        console.log(err);
      }
    })
    //this.products$ = this.productService.getProducts();
  }

  handelCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next : updatedProduct=> {
        product.checked =! product.checked;
      }
    })

  }
  handelDelete(product: Product) {
    if(confirm("Etes vous sûr?"))
    this.productService.deleteProduct(product)
      .subscribe({
        next :value => {
         // this.getProducts();
          this.products = this.products.filter(p=>p.id!=product.id);
        }
      })
  }

  searchProducts() {
    this.productService.searchProducts(this.keyword).subscribe({
        next : value => {
          this.products = value;
        }
    })
  }

 /* handleGotoPage(page: number) {
    this.currentPage = page;
    this.getProducts();
  }*/
  handelEdit(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)
  }
}
