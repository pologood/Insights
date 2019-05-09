/*******************************************************************************
 * Copyright 2019 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs'
import { DataSharedService } from '@insights/common/data-shared-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor, private dataShare: DataSharedService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.tokenExtractor.getToken() as string;
    let auth = this.dataShare.getStoragedProperty('newAuthorization') as string;
    console.log("auth " + auth);
    if (token !== null && auth != undefined) {
      request = request.clone({
        setHeaders: { "XSRF-TOKEN": token, "newAuthorization": auth }
      });
      request = request.clone({
        withCredentials: true
      });
    } else {
      request = request.clone({
        withCredentials: true
      });
    }
    return next.handle(request);
  }
}