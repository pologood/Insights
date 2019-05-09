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
import { Component, OnInit, PipeTransform, Pipe, ViewChild, ElementRef } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { AgentService } from '@insights/app/modules/admin/agent-management/agent-management-service';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { AgentConfigItem } from '@insights/app/modules/admin/agent-management/agent-configuration/agentConfigItem';
import { AdminComponent } from '@insights/app/modules/admin/admin.component';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';


@Component({
    selector: 'add-user-component',
    templateUrl: './add-user.component.html',
    styleUrls: ['./user-onboarding.component.css', './../home.module.css']
})
export class AddUserComponent implements OnInit {




    ngOnInit() {
    }
}