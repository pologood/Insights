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

package com.cognizant.devops.platformservice.security.config;

import java.util.Enumeration;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.cognizant.devops.platformservice.customsettings.CustomAppSettings;

public final class RequestWrapper extends HttpServletRequestWrapper {
	private static Logger LOG = LogManager.getLogger(CustomAppSettings.class);
	HttpServletRequest request;
	HttpServletResponse response;

	public RequestWrapper(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
		super(servletRequest);
		this.request = servletRequest;
		this.response = servletResponse;
	}

	@Override
	public String[] getParameterValues(String parameter) {
		LOG.debug("In getParameterValues .. parameter .......");
		String[] values = super.getParameterValues(parameter);
		if (values == null) {
			return null;
		}
		int count = values.length;
		String[] encodedValues = new String[count];
		for (int i = 0; i < count; i++) {
			encodedValues[i] = cleanXSS(values[i]);
		}

		LOG.debug("arg0 message " + request.getRequestURI() + "    " + request.toString());
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			String paramValues = cleanXSS(request.getParameter(paramName));
			LOG.debug("arg0 ==== paramValues " + paramValues + " " + paramName);
		}

		return encodedValues;
	}

	@Override
	public String getParameter(String parameter) {
		LOG.debug("In getParameter .. parameter .......");
		String value = super.getParameter(parameter);
		if (value == null) {
			return null;
		}
		LOG.info("In getParameter RequestWrapper ........ value .......");
		return cleanXSS(value);
	}

	@Override
	public String getHeader(String name) {
		LOG.debug("In getHeader .. parameter .......");
		String value = super.getHeader(name);
		if (value == null)
			return null;
		LOG.info("In getHeader RequestWrapper ........... value ....");
		return cleanXSS(value);
	}

	private String cleanXSS(String value) {
		// You'll need to remove the spaces from the html entities below
		LOG.debug("In cleanXSS RequestWrapper ..............." + value);
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
		LOG.debug("Out cleanXSS RequestWrapper ........ value ......." + value);
		return value;
	}

	@Override
	public Cookie[] getCookies() {
		Cookie cookie = null;
		Cookie[] cookies = null;
		cookies = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				cookie = cookies[i];
				LOG.debug("  cookie    " + cookie.getName() + "   " + cookie.getValue());
				// if ((cookie.getName()).compareTo("first_name") == 0) {
				cookie.setMaxAge(0);
				cookie.setValue(cleanXSS(cookie.getValue()));
				response.addCookie(cookie);
				// }
			}
		} else {
			LOG.debug("No cookies founds");
		}
		return cookies;
	}
}
