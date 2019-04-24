/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 *   
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * 	of the License at
 *   
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *   
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package com.cognizant.devops.platformcommons.core.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ValidationUtils {
	private static final Logger log = LogManager.getLogger(ComponentHealthLogger.class);
	private static Pattern agentNamePattern = Pattern.compile("[^A-Za-z]", Pattern.CASE_INSENSITIVE);
	private static Pattern CRLF = Pattern.compile("(\r\n|\r|\n|\n\r)");
	private static Pattern agentIdPattern = Pattern.compile("[^A-Za-z0-9\\_]", Pattern.CASE_INSENSITIVE);

	public static String checkHTTPResponseSplitting(String value, boolean isReplace) {
		Pattern CRLF = Pattern.compile("(\r\n|\r|\n|\n\r)");
		Matcher valueMatcher = CRLF.matcher(value);
		if (valueMatcher.find()) {
			if (isReplace) {
				value = value.replace("\\n", "").replace("\\r", "");
			} else {
				value = "";
			}
		}
		return value;
	}

	public static boolean checkString(String toolName) {
		boolean returnBoolean = false;

		Matcher m = agentNamePattern.matcher(toolName);
		if (m.find()) {
			returnBoolean = true;
		}
		return returnBoolean;
	}

	public static boolean checkNewLineCarriage(String value) {
		boolean returnBoolean = false;
		Matcher m = CRLF.matcher(value);
		if (m.find()) {
			returnBoolean = true;
		}
		return returnBoolean;
	}

	public static boolean checkAgentIdString(String agentId) {
		boolean returnBoolean = false;

		Matcher m = agentIdPattern.matcher(agentId);
		if (m.find()) {
			returnBoolean = true;
		}
		return returnBoolean;
	}

}
