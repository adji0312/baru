import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BacklogDevelopment } from './backlogDevelopment';

@Injectable({
  providedIn: 'root'
})
export class BacklogDevelopmentService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.baseUrl}/backlogDevelopment`;

  getAllBacklogDevelopment(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
      return this.http.get(`${this.baseUrl}/all`, {headers: headers});
  }

  updateBacklogDevelopment(id: number, backlogDev: BacklogDevelopment, token: any): Observable<BacklogDevelopment>{
      const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
      return this.http.put<BacklogDevelopment>(`${this.baseUrl}/update/${id}`, backlogDev, {headers: headers});
  }
}
