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
# Turn on a case-insensitive matching (-s set nocasematch)
opt=$1
action=$2
echo "$opt"
case $opt in
        [lL][Ii][nN][uU][Xx])
          case $action in 
            [uU][nN][iI][nN][sS][tT][aA][lL][lL])
	          	sudo service InSightsRallyAgent stop
				sudo rm -R /etc/init.d/InSightsRallyAgent
				echo "Service un-installation step completed"
		        ;;
		    *)
                echo "RallyAgent Running on Linux..."
				sudo cp -xp InSightsRallyAgent.sh  /etc/init.d/InSightsRallyAgent
				sudo chmod +x /etc/init.d/InSightsRallyAgent
				sudo chkconfig InSightsRallyAgent on
				sudo service  InSightsRallyAgent status
				sudo service InSightsRallyAgent stop
				sudo service  InSightsRallyAgent status
				sudo service InSightsRallyAgent start
				sudo service  InSightsRallyAgent status
				echo "Service installed.."
                ;;
		  esac
		  ;;
        [uU][bB][uU][nN][tT][uU])
		   case $action in 
             [uU][nN][iI][nN][sS][tT][aA][lL][lL]) 
				sudo systemctl stop InSightsRallyAgent
				sudo rm -R /etc/systemd/system/InSightsRallyAgent.service
				echo "Service un-installation step completed"				
			    ;;
					
			 *)
                echo "RallyAgent Running on Ubuntu..."
				sudo cp -xp InSightsRallyAgent.service /etc/systemd/system
				sudo systemctl enable InSightsRallyAgent
				sudo systemctl start InSightsRallyAgent
				echo "Service Installed..."
                ;;
		   esac
		   ;;
        centos)
                echo "RallyAgent Running on centso..."
                ;;
        *)
        	    echo "RallyAgent Please provide correct OS input"
esac
