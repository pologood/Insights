import { Component, OnInit } from '@angular/core';
import { RelationshipBuilderService } from '@insights/app/modules/relationship-builder/relationship-builder.service';
import { ShowJsonDialog } from '@insights/app/modules/relationship-builder/show-correlationjson';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RelationLabel } from '@insights/app/modules/relationship-builder/relationship-builder.label';
import { from } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
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
  property1selected: boolean = false;
  neo4jResponse: any;
  property2selected: boolean = false;
  isbuttonenabled: boolean = false;
  dictResponse: any;
  corelationResponse: any;
  corelationResponseMaster: any;
  dataComponentColumns: string[];
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
  isSaveEnabled: boolean = false;
  selectedAgent2: any;
  agent1TableData: any;
  agent2TableData: any;
  finalArrayToSend = [];
  names = [];
  listFilter: boolean;
  readChange: boolean = false;
  readChange2: boolean = false;
  showDetail: boolean = false;
  noShowDetail: boolean = false;
  noShowDetail2: boolean = false;
  showDetail2: boolean = false;
  finalDataSource = {};

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

  constructor(private relationshipBuilderService: RelationshipBuilderService, private dialog: MatDialog) {
    this.dataDictionaryInfo();
    this.getCorrelationBoth();



  }

  ngOnInit() {
  }

  getCorrelationBoth() {
    this.relationmappingLabels = [];
    this.getCorrelationNeo4j();
    this.getCorrelationConfig();
    console.log(this.relationmappingLabels);
    console.log(this.relationmappingLabels.length);

    //if (this.relationmappingLabels.length > 0) {
    //this.userDatasource = this.relationmappingLabels;
    console.log(this.userDatasource)
    //} else {
    //console.log("No data found ");
    //}

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


  getCorrelationNeo4j() {
    //this.neo4jResponse = undefined;
    this.relationDataSource = [];

    this.BothDataSorce = [];
    var self = this;
    this.relationDataSourceNeo4j = []; //var neo4jResponse = await async
    this.relationshipBuilderService.loadUiServiceLocationNeo4j().then(
      (neo4jResponse) => {

        self.neo4jResponseData = neo4jResponse.data;
        if (self.neo4jResponseData != undefined && self.neo4jResponseData.length > 1) {
          for (var masterData of this.neo4jResponseData) {

            let relationLabel = new RelationLabel(masterData.destination, masterData.source, masterData.relationName, true);
            self.relationmappingLabels.push(relationLabel);

            self.relationDataSourceNeo4j.push(masterData.relationName);

          }

        }

        self.showDetail = true;
        this.dataComponentColumns = ['relationName'];
      });
    console.log(this.relationmappingLabels);

  }

  getCorrelationConfig() {
    try {

      this.relationDataSourceNeo4j = [];
      this.relationDataSource = [];
      this.servicesDataSource = [];
      var self = this;
      this.relationshipBuilderService.loadUiServiceLocation().then(
        (corelationResponse) => {
          self.corelationResponseMaster = corelationResponse;
          self.corrprop = corelationResponse.data;


          if (self.corrprop != undefined && self.corrprop.length > 1) {
            for (var masterData of this.corrprop) {

              let relationLabel = new RelationLabel(masterData.destination.toolName, masterData.source.toolName, masterData.relationName, false);
              self.relationmappingLabels.push(relationLabel);
              self.relationDataSource.push(masterData.relationName);

            }

          }



          self.showDetail = true;
          this.dataComponentColumns = ['radio', 'relationName'];
        });
      console.log(this.relationmappingLabels);
    }
    catch (error) {
      console.log(error);
    }
  }


  public getRelationsName(): any {
    console.log(this.selectedRadio)
    if (this.selectedRadio == 'all') {
      return this.relationmappingLabels;
    } else if (this.selectedRadio == 'neo4j') {
      return this.relationmappingLabels.filter(item => item.isdataNeo4j == true);
    } else if (this.selectedRadio == 'file') {
      return this.relationmappingLabels.filter(item => item.isdataNeo4j == false);
    }
  }





  searchTable() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
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
  }
  /*  getCorrelation() {
     try {
       this.BothDataSorce = [];
       this.relationDataSourceNeo4j = [];
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
               var az = typeof (t);
               //console.log(t);
               // console.log(b);
               var c = (element.source.toolName);
               this.relationDataSource.push(a)
               this.servicesDataSource.push(element);
 
 
             }
           }
           //this.relData = this.relationDataSource;
           //console.log(this.relData);
           this.dataComponentColumns = ['relationName'];
         });
     }
     catch (error) {
       console.log(error);
     }
   }
  */
  showDetailsDialog() {

    let showJsonDialog = this.dialog.open(ShowJsonDialog, {
      panelClass: 'showjson-dialog-container',
      height: '500px',
      width: '700px',
      disableClose: true,
      data: this.corelationResponseMaster,

    });
    //console.log(showJsonDialog);
  }

  addproperty() {

  }

  Refresh() {

  }

  Delete() {
    this.isListView = true;
    this.isEditData = true;





    //console.log(this.selectedDummyAgent);
    // console.log(this.servicesDataSource);
    for (var key in this.servicesDataSource) {
      if (this.servicesDataSource[key].relationName != this.selectedDummyAgent) {
        this.updatedDatasource.push(this.servicesDataSource[key])
      }
    }
    //console.log(this.selectedDummyAgent);
    console.log(this.updatedDatasource);

    //var deleteMappingJson = JSON.stringify(this.updatedDatasource);
    var deleteMappingJson = JSON.stringify({ 'data': this.updatedDatasource });
    //console.log(deleteMappingJson);

    this.relationshipBuilderService.saveCorrelationConfig(deleteMappingJson).then(
      (corelationResponse2) => {
        //console.log(corelationResponse2)
        // console.log(this.updatedDatasource);
        // console.log(this.relationDataSource);
        // console.log(this.servicesDataSource);
        if (corelationResponse2.status == "success") {
          this.updatedDatasource = [];
          this.relationDataSource = [];
          this.servicesDataSource = [];
          this.getCorrelationConfig();
        }
      });
  }
  enableDelete() {
    this.isbuttonenabled = true;
    //console.log(this.isbuttonenabled);
  }

  enableSaveProperty1() {
    this.property1selected = true;
    if (this.property2selected == true) {
      console.log("true");
      this.isSaveEnabled = true;
    }


  }


  enableSaveProperty2() {
    this.property2selected = true;
    if (this.property1selected == true) {
      console.log("true");
      this.isSaveEnabled = true;
    }
  }

  PropertyAdd() {

  }


  saveData(newName) {
    this.isListView = true;
    this.isEditData = true;

    //this.updatedDatasource.push({});
    //console.log(newName);
    //this.updatedDatasource.push({ destination: this.selectedAgent2, source: this.selectedAgent1, relationName: newName.value });
    //this.updatedDatasource.push({});
    // console.log(this.updatedDatasource);
    //console.log(this.selectedAgent2);
    this.fieldDestProp.push(this.selectedProperty2);
    //console.log(this.fieldDestProp);
    // console.log(typeof (this.selectedAgent2));
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


    this.finalDataSource = { 'destination': this.AddDestination, 'source': this.AddSource, 'relationName': newName.value }
    this.servicesDataSource.push(this.finalDataSource);
    console.log(this.servicesDataSource);
    var addMappingJson = JSON.stringify({ 'data': this.servicesDataSource });
    this.relationshipBuilderService.saveCorrelationConfig(addMappingJson).then(
      (corelationResponse2) => {

        if (corelationResponse2.status == "success") {

          this.getCorrelationBoth();
        }
      });

  }
  deleteMapping() {

  }







}