import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesHebdo } from './notes-hebdo';

describe('NotesHebdo', () => {
  let component: NotesHebdo;
  let fixture: ComponentFixture<NotesHebdo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesHebdo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesHebdo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
