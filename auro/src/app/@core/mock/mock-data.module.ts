import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

 //import { UserService } from './users.service';

 /*
const SERVICES = [
];
*/

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
   // ...SERVICES,
  ],
})
export class MockDataModule {
  static forRoot(): ModuleWithProviders<MockDataModule> {
    return {
      ngModule: MockDataModule,
      providers: [
       // ...SERVICES,
      ],
    };
  }
}
