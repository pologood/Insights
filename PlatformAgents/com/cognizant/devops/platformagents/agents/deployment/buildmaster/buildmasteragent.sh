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
#! /bin/sh
# /etc/init.d/__AGENT_KEY__

### BEGIN INIT INFO
# Provides: Runs a Python script on startup
# Required-Start: BootPython start
# Required-Stop: BootPython stop
# Default-Start: 2 3 4 5
# Default-stop: 0 1 6
# Short-Description: Simple script to run python program at boot
# Description: Runs a python program at boot
### END INIT INFO
#export INSIGHTS_AGENT_HOME=/home/ec2-user/insightsagents
source /etc/profile

case "$1" in
  start)
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsBuildMasterAgent already running"
    else
     echo "Starting InSightsBuildMasterAgent"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/buildmaster
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.deployment.buildmaster.BuildMasterAgent import BuildMasterAgent; BuildMasterAgent()" &
    fi
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsBuildMasterAgent Started Sucessfully"
    else
     echo "InSightsBuildMasterAgent Failed to Start"
    fi
    ;;
  stop)
    echo "Stopping InSightsBuildMasterAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     sudo kill -9 $(ps aux | grep '__PS_KEY__' | awk '{print $2}')
    else
     echo "InSightsBuildMasterAgent already in stopped state"
    fi
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsBuildMasterAgent Failed to Stop"
    else
     echo "InSightsBuildMasterAgent Stopped"
    fi
    ;;
  restart)
    echo "Restarting InSightsBuildMasterAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsBuildMasterAgent stopping"
     sudo kill -9 $(ps aux | grep '__PS_KEY__' | awk '{print $2}')
     echo "InSightsBuildMasterAgent stopped"
     echo "InSightsBuildMasterAgent starting"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/buildmaster
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.deployment.buildmaster.BuildMasterAgent import BuildMasterAgent; BuildMasterAgent()" &
     echo "InSightsBuildMasterAgent started"
    else
     echo "InSightsBuildMasterAgent already in stopped state"
     echo "InSightsBuildMasterAgent starting"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/buildmaster
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.deployment.buildmaster.BuildMasterAgent import BuildMasterAgent; BuildMasterAgent()" &
     echo "InSightsBuildMasterAgent started"
    fi
    ;;
  status)
    echo "Checking the Status of InSightsBuildMasterAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsBuildMasterAgent is running"
    else
     echo "InSightsBuildMasterAgent is stopped"
    fi
    ;;
  *)
    echo "Usage: /etc/init.d/__AGENT_KEY__ {start|stop|restart|status}"
    exit 1
    ;;
esac
exit 0