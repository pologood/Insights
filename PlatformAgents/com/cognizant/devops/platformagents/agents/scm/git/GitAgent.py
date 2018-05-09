#-------------------------------------------------------------------------------
# Copyright 2017 Cognizant Technology Solutions
# 
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------
'''
Created on Jun 16, 2016

@author: 146414
'''
from dateutil import parser
import datetime
from com.cognizant.devops.platformagents.core.BaseAgent import BaseAgent
import logging

class GitAgent(BaseAgent):
    def process(self):
        getRepos = self.config.get("getRepos", '')
        accessToken = self.config.get("accessToken", '')
        commitsBaseEndPoint = self.config.get("commitsBaseEndPoint", '')
        startFrom = self.config.get("startFrom", '')
        startFrom = parser.parse(startFrom)
        #startFrom = startFrom.strftime('%Y-%m-%dT%H:%M:%SZ')
        getReposUrl = getRepos+"?access_token="+accessToken
        enableBranches = self.config.get("enableBranches", False)
        repos = self.getResponse(getReposUrl+'&per_page=100&sort=created&page=1', 'GET', None, None, None)
        
        relationMetadata = self.config.get('dynamicTemplate', {}).get('relationMetadata', None)
        commitMetadata = self.config.get('dynamicTemplate', {}).get('commitMetadata', None)
        responseTemplate = self.config.get('dynamicTemplate', {}).get('commitresponseTemplate', None)
        
        #responseTemplate = self.getResponseTemplate()
        repoPageNum = 1
        fetchNextPage = True
        while fetchNextPage:
            if len(repos) == 0:
                fetchNextPage = False
                break;
            for repo in repos:
                repoName = repo.get('name', None)
                trackingDetails = self.tracking.get(repoName,None)
                if trackingDetails is None:
                    trackingDetails = {}
                    self.tracking[repoName] = trackingDetails
                repoModificationTime = trackingDetails.get('repoModificationTime', None)
                if repoModificationTime is None:
                    repoModificationTime = startFrom
                repoUpdatedAt = repo.get('pushed_at', None)
                if repoUpdatedAt is None:
                    repoUpdatedAt = repo.get('updated_at')
                repoUpdatedAt = parser.parse(repoUpdatedAt, ignoretz=True)

                branch_from_tracking_json = []
                for key in trackingDetails:
                    if key != "repoModificationTime":
                        branch_from_tracking_json.append(key)
                
                if startFrom < repoUpdatedAt:
                    trackingDetails['repoModificationTime'] = repo.get('updated_at')
                    branches = ['master']
                    if repoName != None:
                        if enableBranches:
                            branches = []
                            allBranches = []
                            branchPage = 1
                            fetchNextBranchPage = True
                            while fetchNextBranchPage:
                                getBranchesRestUrl = commitsBaseEndPoint+repoName+'/branches?access_token='+accessToken+'&page='+str(branchPage)
                                branchDetails = self.getResponse(getBranchesRestUrl, 'GET', None, None, None)
                                for branch in branchDetails:
                                    branchName = branch['name']
                                    branchTracking = trackingDetails.get(branchName, {}).get('latestCommitId', None)
                                    allBranches.append(branchName)
                                    if branchTracking is None or branchTracking != branch.get('commit', {}).get('sha', None):
                                        branches.append(branchName)
                                if len(branchDetails) == 30:
                                    branchPage = branchPage + 1
                                else:
                                    fetchNextBranchPage = False
                                    break    
                            if len(branches) > 0 :
                                activeBranches = [{ 'repoName' : repoName, 'activeBranches' : allBranches, 'gitType' : 'metadata'}]
                                metadata = {
                                        "dataUpdateSupported" : True,
                                        "uniqueKey" : ["repoName", "gitType"]
                                    }
                                self.publishToolsData(activeBranches, metadata)

                        for key in branch_from_tracking_json:
                            if key not in allBranches:
                                tracking = self.tracking.get(repoName,None)
                                branchDeletion = trackingDetails.get(key, {}).get('Delete', None)
                                if branchDeletion == False and branchDeletion != True:
                                    self.updateTrackingForBranchCreateDelete(trackingDetails, repoName, key, True)
                                
                        for branch in branches:
                            data = []
                            
                            commit_data=[]
                            
                            injectData = {}
                            injectData['repoName'] = repoName
                            injectData['branchName'] = branch
                            parsedBranch = branch
                            if '+' in parsedBranch:
                                parsedBranch = parsedBranch.replace('+', '%2B')
                            if '&' in parsedBranch:
                                parsedBranch = parsedBranch.replace('&', '%26')
                            fetchNextCommitsPage = True
                            getCommitDetailsUrl = commitsBaseEndPoint+repoName+'/commits?sha='+parsedBranch+'&access_token='+accessToken+'&per_page=100'
                            since = trackingDetails.get(branch, {}).get('latestCommitDate', None)
                            if since != None:
                                getCommitDetailsUrl += '&since='+since
                            commitsPageNum = 1
                            latestCommit = None
                            while fetchNextCommitsPage:
                                try:
                                    commits = self.getResponse(getCommitDetailsUrl + '&page='+str(commitsPageNum), 'GET', None, None, None)
                                    if latestCommit is None and len(commits) > 0:
                                        latestCommit = commits[0]
                                    for commit in commits:
                                        if since is not None or startFrom < parser.parse(commit["commit"]["author"]["date"], ignoretz=True):
                                            data += self.parseResponse(responseTemplate, commit, injectData)

                                            commit_data += self.getCommitInformation(commit,repoName,parsedBranch,commit["sha"],commit["commit"]["message"],commit["commit"]["author"]["name"])
                                            
                                        else:
                                            fetchNextCommitsPage = False

                                            delete_status = False
                                            self.updateTrackingForBranch(trackingDetails, branch, latestCommit, delete_status)
                                            
                                            break
                                    if len(commits) == 0 or len(data) == 0 or len(commits) < 100:
                                        fetchNextCommitsPage = False
                                        break
                                except Exception as ex:
                                    fetchNextCommitsPage = False
                                    logging.error(ex)
                                commitsPageNum = commitsPageNum + 1
                            if len(data) > 0:
                                #self.updateTrackingForBranch(trackingDetails, branch, latestCommit)

                                self.publishToolsData(commit_data,commitMetadata)
                                self.publishToolsData(data, relationMetadata)

                                delete_status = True
                                self.updateTrackingForBranch(trackingDetails, branch, latestCommit, delete_status)

                                #self.publishToolsData(data)
                            self.updateTrackingJson(self.tracking)
            repoPageNum = repoPageNum + 1
            repos = self.getResponse(getReposUrl+'&per_page=100&sort=created&page='+str(repoPageNum), 'GET', None, None, None)

        self.updateTrackingJson(self.tracking)

    def getCommitInformation(self, commit_pass, repoName, parsedBranch, commitId, commitMessage, commitName):
        data_commit=[]
        commit_obj = {}
        commit_obj['commitId'] = commitId
        commit_obj['repoName'] = repoName
        commit_obj['authorName'] = commitName
        commit_obj['commitMessage'] = commitMessage
        data_commit.append(commit_obj)
        return data_commit

    def updateTrackingForBranch(self, trackingDetails, branchName, latestCommit, delete_status):
        updatetimestamp = latestCommit["commit"]["author"]["date"]
        dt = parser.parse(updatetimestamp)
        fromDateTime = dt + datetime.timedelta(seconds=01)
        fromDateTime = fromDateTime.strftime('%Y-%m-%dT%H:%M:%SZ')    
        #trackingDetails[branchName] = { 'latestCommitDate' : fromDateTime, 'latestCommitId' : latestCommit["sha"]}
        trackingDetails[branchName] = { 'latestCommitDate' : fromDateTime, 'latestCommitId' : latestCommit["sha"], 'Delete' : delete_status}
    def updateTrackingForBranchCreateDelete(self, trackingDetails, repoName, branchName, delete_status):
        trackingDetails = self.tracking.get(repoName,None)
        #branchMetadata = self.config.get("branchMetadata", '')
        branchMetadata = self.config.get('dynamicTemplate', {}).get('branchMetadata', None)
        data_branch_delete=[]
        branch_delete = {}
        branch_delete['BranchName'] = branchName
        branch_delete['RepoName'] = repoName
        branch_delete['Event'] = "Branch Deletion"
        data_branch_delete.append(branch_delete)
        self.publishToolsData(data_branch_delete, branchMetadata)
        trackingDetails[branchName] = { 'latestCommitDate' : trackingDetails[branchName]['latestCommitDate'], 'latestCommitId' : trackingDetails[branchName]['latestCommitId'], 'Delete' : delete_status}
        
if __name__ == "__main__":
    GitAgent()       
