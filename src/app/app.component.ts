import { Component } from '@angular/core';
// import * as PouchDB from 'pouchdb';
import { ITeam, Team } from './team';

// declare var PouchDB: any;
import 'pouchdb';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  public teams: Promise<ITeam[]>;
  public form: ITeam;

  public db: PouchDB.Database<ITeam>;

  constructor() {
    this.form = new Team();
    this.teams = Promise.resolve([]);
    
    this.db = new PouchDB<ITeam>('http://localhost:5984/teamsdb', {
      adapter: 'websql'
    });
    
    this.db.replicate.to('http://localhost:5984/teamsdb', { live: true });
    this.db.replicate.from('http://localhost:5984/teamsdb', { live: true });

    this.db.changes({ since: 'now', live: true }).on('change', (change) => {
      console.log("Change", change);
    }).on('error', (error) => {
      console.error("Error", error);
    });
  }

  ngOnInit() {
    let fetchCycle = setInterval(() => {
      this.teams = this.fetchDocuments();      
    }, 5000);
  }

  saveData(form: ITeam) {
    let document: PouchDB.Core.Document<ITeam> = {
      _id: this.uuidv4(),
      teamName: form.teamName,
      teamScore: form.teamScore
    }
    
    this.db.put(document)
      .then(r => {
        console.log("Data Saved");
        this.teams = this.fetchDocuments();
      }).catch(e => {
        console.error("Error happend", e);
      });
  }

  removeTeam(team: ITeam) {
    if(team && team._id) {
      this.db.get(team._id)
        .then(d => {
          this.db.remove(d).then(() => {
            this.teams = this.fetchDocuments();
          });
        });
    }
  }

  private fetchDocuments() {
    return this.db.allDocs({ include_docs: true })
      .then(r => {        
        return r.rows.map(x => x.doc);
      });
  }

  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}