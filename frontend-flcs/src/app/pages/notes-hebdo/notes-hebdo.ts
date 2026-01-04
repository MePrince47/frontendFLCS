import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-hebdo',
  imports: [FormsModule],
  templateUrl: './notes-hebdo.html',
})
export class NotesHebdo {
  candidatId!: string | null;

  notes = {
    s1: null,
    s2: null,
    s3: null,
    s4: null,
    s5: null,
  };

  constructor(private route: ActivatedRoute) {
    this.candidatId = this.route.snapshot.paramMap.get('id');
  }

  enregistrer() {
    console.log('Candidat:', this.candidatId);
    console.log('Notes:', this.notes);
  }
}
