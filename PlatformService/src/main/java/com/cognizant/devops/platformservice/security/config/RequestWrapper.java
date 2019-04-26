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

import com.cognizant.devops.platformcommons.core.util.ValidationUtils;
import com.cognizant.devops.platformservice.customsettings.CustomAppSettings;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;

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
			encodedValues[i] = ValidationUtils.cleanXSS(values[i]);
		}

		LOG.debug("arg0 message " + request.getRequestURI() + "    " + request.toString());
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			String paramValues = ValidationUtils.cleanXSS(request.getParameter(paramName));
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
		return ValidationUtils.cleanXSS(value);
	}

	@Override
	public String getHeader(String name) {
		LOG.debug("In getHeader .. parameter .......");
		String value = super.getHeader(name);
		if (value == null)
			return null;
		LOG.info("In getHeader RequestWrapper ........... value ....");
		return ValidationUtils.cleanXSS(value);
	}



	@Override
	public Cookie[] getCookies() {
		LOG.debug(" in RequestWrapper cookies =============== ");
		Cookie[] cookies = null;
		Cookie cookie = null;
		cookies = PlatformServiceUtil.validateCookies(request.getCookies());
		/*
		 * for (int i = 0; i < cookies.length; i++) { cookie = cookies[i];
		 * response.addCookie(cookie); }
		 */
		return cookies;
	}


}
