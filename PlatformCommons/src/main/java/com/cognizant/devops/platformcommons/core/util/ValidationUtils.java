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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

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

	public static JsonObject validateStringForHTMLContent(JsonObject data) {
		String strRegEx = "<[^>]*>";
		String jsonString = "";
		JsonObject json = null;

		log.debug(" validateStringForHTMLContent  before  " + data);
		// String jsonString = new Gson().toJson(data);
		log.debug(" validateStringForHTMLContent  before data   " + data.getClass());

		if (data instanceof JsonObject) {
			jsonString = data.toString();
			log.debug(" validateStringForHTMLContent  after  assigment  " + jsonString);
			if (jsonString != null) {
				jsonString = jsonString.replaceAll(strRegEx, "");
				// replace &nbsp; with space
				jsonString = jsonString.replace("&nbsp;", " ");
				// replace &amp; with &
				jsonString = jsonString.replace("&amp;", "&");
				// OR remove all HTML entities
				// jsonString = jsonString.replaceAll("&.*?;", "");
			}
			log.debug(" validateStringForHTMLContent  after  " + jsonString);
			json = new Gson().fromJson(jsonString, JsonObject.class);
		}
		return json;
	}

	public static String cleanXSS(String value) {
		if (value != null || !("").equals(value)) {
			// You'll need to remove the spaces from the html entities below
			log.debug("In cleanXSS RequestWrapper ..............." + value);
			// value = value.replaceAll("<", "& lt;").replaceAll(">", "& gt;");
			// value = value.replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;");
			// value = value.replaceAll("'", "& #39;");
			value = value.replaceAll("eval\\((.*)\\)", "");
			value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");

			value = value.replaceAll("(?i)<script.*?>.*?<script.*?>", "");
			value = value.replaceAll("(?i)<script.*?>.*?</script.*?>", "");
			value = value.replaceAll("(?i)<.*?javascript:.*?>.*?</.*?>", "");
			value = value.replaceAll("(?i)<.*?\\s+on.*?>.*?</.*?>", "");
			value = value.replace("\\n", "").replace("\\r", "");
			// value = value.replaceAll("<script>", "");
			// value = value.replaceAll("</script>", "");
		}
		log.debug("Out cleanXSS RequestWrapper ........ value ......." + value);
		return value;
	}
}
