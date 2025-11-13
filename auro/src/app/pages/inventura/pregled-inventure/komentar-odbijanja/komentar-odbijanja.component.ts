import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-komentar-odbijanja',
  templateUrl: './komentar-odbijanja.component.html',
  styleUrls: ['./komentar-odbijanja.component.scss']
})
export class KomentarOdbijanjaComponent implements OnInit {
  komentar: string;

  constructor(protected dialogRef: NbDialogRef<KomentarOdbijanjaComponent>) { }

  ngOnInit(): void {
  }

  spremi(){
    this.dialogRef.close(this.komentar);
  }

  zatvori(){
    this.dialogRef.close();
  }
}
