import { IsAdminGuard } from "@auth/guards/is-admin.guard";
import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.compoenent";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";

export const adminDashboardRoutes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [ IsAdminGuard ],
    children: [
      {
        path: 'products',
        component: ProductsAdminPageComponent,
      },
      {
        path: 'products/:id',
        component: ProductAdminPageComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      }
    ]

  }
]

export default adminDashboardRoutes;
