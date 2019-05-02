import { Component, OnInit } from '@angular/core';
import { RelationshipBuilderService } from '@insights/app/modules/relationship-builder/relationship-builder.service';
import { ShowJsonDialog } from '@insights/app/modules/relationship-builder/show-correlationjson';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RelationLabel } from '@insights/app/modules/relationship-builder/relationship-builder.label';
import { from } from 'rxjs';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';
import { MatTableDataSource } from '@angular/material';
import { DataSharedService } from '@insights/common/data-shared-service';
//import { Control} from '@angular/common';
@Component({
  selector: 'app-relationship-builder',
  templateUrl: './relationship-builder.component.html',
  styleUrls: ['./relationship-builder.component.css', './../home.module.css']
})
export class RelationshipBuilderComponent implements OnInit {
  selectedDummyAgent: any = undefined;
  element: any = undefined;
  updatedDatasource = [];
  BothDataSorce = [];

  relationmappingLabels: RelationLabel[] = [];
  neo4jResponseData: any = [];
  prefixname: string = '';
  property1selected: boolean = false;
  neo4jResponse: any;
  searchValue: string = '';
  property2selected: boolean = false;
  isbuttonenabled: boolean = false;
  dictResponse: any;
  corelationResponse: any;
  corelationResponseMaster: any;
  dataComponentColumns = [];
  agentDataSource = [];
  AddDestination = {};
  newSource = [];
  AddSource = {};
  corrprop = [];
  fieldDestProp = [];
  fieldSourceProp = [];
  servicesDataSource = [];
  agentNodes = [];
  selectedProperty2: any;
  selectedProperty1: any;
  displayedAgentColumns: string[];
  selectedAgent1: any;
  newDest = [];
  userDatasource = [];
  isListView = false;
  isEditData = false;
  isrefresh: boolean = false;
  isSaveEnabled: boolean = false;
  selectedAgent2: any;
  agent1TableData: any;
  agent2TableData: any;
  finalArrayToSend = [];
  finalRelationName: string = '';
  names = [];
  listFilter: any;
  readChange: boolean = false;
  readChange2: boolean = false;
  showDetail: boolean = false;
  noShowDetail: boolean = false;
  noShowDetail2: boolean = false;
  showDetail2: boolean = false;
  finalDataSource = {};
  isDisabledState: boolean = false;
  MAX_ROWS_PER_TABLE = 5;
  showDetail3: boolean = false;
  noShowDetailCorr: boolean = false;
  relationPropertiesSize: boolean = false;
  showNoToolsSelectedForCorrelation: boolean = false;
  buttonOn: boolean = false;
  clicked: boolean = false;
  startToolNullPropertiesMessage = ""
  endToolNullPropertiesMessage = ""
  agent1Tool: any;
  agent1Category: any;
  agent2Tool: any;
  agent2Category: any;
  public data: any;
  corrData: any;
  selectedMappingAgent: any;
  selectedMappingAgent2: any;
  NewDataSource = {};
  masterData: any;
  selectedRadio: any;


  relData: any;
  relationDataSource = [];
  relationDataSourceNeo4j = [];

  constructor(private router: Router, private relationshipBuilderService: RelationshipBuilderService, private dialog: MatDialog, public messageDialog: MessageDialogService, private dataShare: DataSharedService) {
    this.dataDictionaryInfo();
    this.getCorrelation();



  }

  ngOnInit() {
  }



  async dataDictionaryInfo() {
    try {
      // Loads Agent , Data Component and Services
      this.dictResponse = await this.relationshipBuilderService.loadToolsAndCategories();
      if (this.dictResponse != null) {
        for (var key in this.dictResponse.data) {
          this.agentDataSource.push(this.dictResponse.data[key]);
        }

      }
    } catch (error) {
      console.log(error);
    }
  }
  async loadAgent1Info(selectedAgent1) {
    try {
      this.isrefresh = true;
      this.noShowDetail = true;
      this.clicked = false;
      this.buttonOn = false;
      let usersResponseData1 = await this.relationshipBuilderService.loadToolProperties(selectedAgent1.toolName, selectedAgent1.categoryName);
      //console.log(usersResponseData)
      this.agent1Tool = selectedAgent1.toolName;
      this.agent1Category = selectedAgent1.categoryName;
      if (usersResponseData1.data != undefined && usersResponseData1.status == "success") {
        this.showDetail = true;
        this.noShowDetail = false;
        this.agent1TableData = usersResponseData1.data;
        //console.log(this.agent1Category);

      } else {
        this.noShowDetail = true;
        this.showDetail = false;
        this.startToolNullPropertiesMessage = "No properties found"
        //console.log(this.startToolNullPropertiesMessage)
      }
    } catch (error) {
      console.log(error);
    }
  }
  async loadAgent1Info2(selectedAgent2) {
    try {
      this.isrefresh = true;
      this.noShowDetail2 = true;
      this.noShowDetailCorr = false;
      this.showDetail3 = false;
      this.buttonOn = false;
      this.clicked = false;
      //console.log(selectedAgent2)
      let usersResponseData2 = await this.relationshipBuilderService.loadToolProperties(selectedAgent2.toolName, selectedAgent2.categoryName);
      this.agent2Tool = selectedAgent2.toolName;
      this.agent2Category = selectedAgent2.categoryName;
      if (usersResponseData2.data != undefined && usersResponseData2.status == "success") {
        //console.log(usersResponseData.data);
        this.showDetail2 = true;
        this.noShowDetail2 = false;
        this.agent2TableData = usersResponseData2.data;
      } else {
        this.noShowDetail2 = true;
        this.showDetail2 = false;
        this.endToolNullPropertiesMessage = "No properties found"
        //console.log(this.endToolNullPropertiesMessage)
      }
    } catch (error) {
      console.log(error);
    }
  }








  /* searchTable() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    console.log(tr);
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
        if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
          found = true;
        }
      }
      if (found) {
        tr[i].style.display = "";
        found = false;
      } else {
        tr[i].style.display = "none";
      }
    }
  } */



  getCorrelation() {
    try {

      this.relationDataSource = [];
      this.servicesDataSource = [];
      var self = this;
      this.relationshipBuilderService.loadUiServiceLocation().then(
        (corelationResponse) => {


          // var ax = typeof (corelationResponse);
          // console.log(ax);
          self.corelationResponseMaster = corelationResponse;
          this.corrprop = corelationResponse.data;
          //console.log(corelationResponse);
          // console.log(self.corelationResponseMaster);
          // console.log(this.corrprop);
          if (this.corrprop != null) {
            for (var key in this.corrprop) {
              // console.log(key);
              var element = this.corrprop[key];
              // var ay = typeof (element);
              // console.log(ay);
              var a = (element.relationName);
              var t = (element.destination);
              var b = (element.destination.toolName);

              var c = (element.source.toolName);
              this.relationDataSource.push(a)
              console.log(this.relationDataSource);
              this.servicesDataSource.push(element);


            }
          }
          this.relData = this.relationDataSource;
          //console.log(this.relData);
          this.dataComponentColumns = ['radio', 'relationName'];
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async showDetailsDialogForNeo4j(data1, data2) {


    try {
      this.showDetail3 = false;
      this.noShowDetailCorr = false;
      this.clicked = true;
      this.buttonOn = true;
      this.showNoToolsSelectedForCorrelation = true
      //console.log(data1.toolName, data2.toolName);
      let usersResponseData3 = await this.relationshipBuilderService.loadToolsRelationshipAndProperties(data1.toolName, data1.categoryName, data2.toolName, data2.categoryName);
      if (usersResponseData3.data != undefined && usersResponseData3.status == "success") {

        // console.log(usersResponseData3)

        // console.log(usersResponseData3.data)
        if (usersResponseData3.data["relationName"] != undefined) {
          this.showDetail3 = true;
          this.noShowDetailCorr = false;
          this.corrprop = usersResponseData3.data["relationName"];
          console.log(this.corrprop);


          var isSessionExpired = this.dataShare.validateSession();
          if (!isSessionExpired) {
            let showJsonDialog = this.dialog.open(ShowJsonDialog, {
              panelClass: 'showjson-dialog-container',
              height: '300px',
              width: '500px',
              disableClose: true,
              /*  data: this.corrprop,
               title: 'Message', */
              data:
              {
                message: this.corrprop,
                title: "Co-Relations in Neo4j"

              }






            });
            //console.log(showJsonDialog);
          }
          //console.log(Object.keys(usersResponseData3.data["properties"]).length);

        }
      } else {
        this.noShowDetailCorr = true;
        this.showDetail3 = false;


        var isSessionExpired = this.dataShare.validateSession();
        if (!isSessionExpired) {
          let showJsonDialog = this.dialog.open(ShowJsonDialog, {
            panelClass: 'showjson-dialog-container',
            height: '300px',
            width: '500px',
            disableClose: true,
            /*  data: this.corrprop,
             title: 'Message', */
            data:
            {
              message: 'No Relations Found',
              title: "Co-Relations in Neo4j"

            }






          });
          //console.log(showJsonDialog);
        }



      }
    } catch (error) {
      console.log(error);

    }

  }

  showDetailsDialog() {
    var isSessionExpired = this.dataShare.validateSession();
    if (!isSessionExpired) {
      let showJsonDialog = this.dialog.open(ShowJsonDialog, {
        panelClass: 'showjson-dialog-container',
        height: '500px',
        width: '700px',
        disableClose: true,
        data:
        {
          message: this.corelationResponseMaster,
          title: "Correlation.json"
        }

      });
      //console.log(showJsonDialog);
    }
  }
  addproperty() {

  }

  Refresh() {
    /*  var self = this;
     this.router.navigateByUrl('@insights/app/modules/relationship-builder', { skipLocationChange: true }).then(() =>
       self.router.navigate(["InSights/Home/relationship-builder"])); */

    this.showDetail = false;
    this.showDetail2 = false;
    this.agentDataSource = [];
    this.selectedProperty1 = "";
    this.selectedProperty2 = "";
    this.searchValue = null;
    this.selectedRadio = "";
    this.isbuttonenabled = false;
    this.isSaveEnabled = false;
    this.listFilter = "";
    this.isrefresh = false;
    this.buttonOn = false;
    this.selectedAgent1 = "";
    this.dataDictionaryInfo();

  }

  relationDelete() {
    this.isListView = true;
    this.isEditData = true;
    //console.log(this.corrprop);
    // console.log(this.selectedDummyAgent);

    var title = "Delete Correlation";
    console.log(this.selectedDummyAgent);
    var dialogmessage = "You are deleting " + "<b>" + this.selectedDummyAgent + "</b>" + "- the action of deleting a co-relationship CANNOT be UNDONE, moreover deleting an existing co-relationship may impact other functionalities. Are you sure you want to DELETE <b>" + this.selectedDummyAgent + "</b>";
    const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, this.selectedDummyAgent, "ALERT", "40%");

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'yes') {
        for (var key in this.corrprop) {
          if (this.corrprop[key].relationName != this.selectedDummyAgent) {
            this.updatedDatasource.push(this.corrprop[key])
          }
        }
        // console.log(this.updatedDatasource);
        //var deleteMappingJson = JSON.stringify(this.updatedDatasource);
        var deleteMappingJson = JSON.stringify({ 'data': this.updatedDatasource });
        this.relationshipBuilderService.saveCorrelationConfig(deleteMappingJson).then(
          (corelationResponse2) => {
            // console.log(corelationResponse2);
            if (corelationResponse2.status == "success") {
              // console.log("Check");
              this.updatedDatasource = [];
              this.relationDataSource = [];
              this.servicesDataSource = [];
              //  console.log("Before")
              this.getCorrelation();
              //console.log("After")


            }
          });

      }
    });

  }


  enableDelete() {
    this.isbuttonenabled = true;
    this.isrefresh = true;
    //console.log(this.isbuttonenabled);
  }

  enableSaveProperty1() {
    this.property1selected = true;
    if (this.property2selected == true) {
      //console.log("true");
      this.isSaveEnabled = true;
    }
  }


  enableSaveProperty2() {
    this.property2selected = true;
    if (this.property1selected == true) {
      //console.log("true");
      this.isSaveEnabled = true;
    }
  }

  PropertyAdd() {

  }


  saveData(newName) {
    this.isListView = true;
    this.isEditData = true;
    // console.log(typeof (newName.value));

    this.prefixname = "FROM_" + this.selectedAgent1.toolName + "_TO_" + this.selectedAgent2.toolName + "_";
    console.log(this.prefixname);
    this.finalRelationName = this.prefixname + newName.value;
    console.log(this.finalRelationName);
    var title = "Save Co-Relation";
    var dialogmessage = "You are saving " + "<b>" + this.finalRelationName + "</b>" + " co-relationship between <b>" + this.selectedAgent1.toolName + "</b> and  <b> " + this.selectedAgent2.toolName + "</b> . Are you sure you want to SAVE? ";
    const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, this.selectedDummyAgent, "ALERT", "40%");

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'yes') {
        //DESTINATION
        this.fieldDestProp.push(this.selectedProperty2);

        var res = [];
        for (var x in this.selectedAgent2) {
          this.selectedAgent2.hasOwnProperty(x) && res.push(this.selectedAgent2[x])
        }

        var toolname = res[0];
        var toolcatergory = res[1];

        this.AddDestination = { 'toolName': toolname, 'toolCategory': toolcatergory, 'fields': this.fieldDestProp };



        //FOR SOURCE 
        this.fieldSourceProp.push(this.selectedProperty1);

        var res1 = [];
        for (var x in this.selectedAgent2) {
          this.selectedAgent1.hasOwnProperty(x) && res1.push(this.selectedAgent1[x])
        }

        var toolname1 = res1[0];
        var toolcatergory1 = res1[1];

        this.AddSource = { 'toolName': toolname1, 'toolCategory': toolcatergory1, 'fields': this.fieldSourceProp };


        var newData = {
          'destination': this.AddDestination, 'source': this.AddSource, 'relationName': this.finalRelationName
        }

        this.servicesDataSource.push(newData);
        console.log(this.servicesDataSource);
        var addMappingJson = JSON.stringify({ 'data': this.servicesDataSource });
        this.relationshipBuilderService.saveCorrelationConfig(addMappingJson).then(
          (corelationResponse2) => {

            if (corelationResponse2.status == "success") {

              this.getCorrelation();


            }
          });
      }
    });


  }
  deleteMapping() {

  }
}
