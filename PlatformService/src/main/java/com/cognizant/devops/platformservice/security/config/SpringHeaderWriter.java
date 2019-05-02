/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
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
package com.cognizant.devops.platformservice.security.config;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.security.web.header.HeaderWriter;
import org.springframework.stereotype.Component;

import com.cognizant.devops.platformcommons.core.util.ValidationUtils;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;

@Component
public class SpringHeaderWriter implements HeaderWriter {
	private static final Logger log = LogManager.getLogger(PlatformServiceUtil.class);

	@Override
	public void writeHeaders(HttpServletRequest request, HttpServletResponse response) {
		log.debug(" Write Header ============ ");
		response.setStatus(HttpServletResponse.SC_OK);
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, request.getHeader(HttpHeaders.ORIGIN));
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS));
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD));
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        // 463188 - Response Headers for Control: no-cache, no-store header
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
        //Set the response headers for grafana details.
        Object attribute = request.getAttribute("responseHeaders");
        if(attribute != null){
        	Map<String, String> grafanaHeaders = (Map<String, String>)attribute;
        	for(Map.Entry<String, String> entry : grafanaHeaders.entrySet()){
				Cookie cookie = new Cookie(entry.getKey(), ValidationUtils.cleanXSS(entry.getValue()));
				// cookie.setHttpOnly(true); //3
				cookie.setMaxAge(60 * 30);
				cookie.setPath("/");
				response.addCookie(cookie);
        	}
        }
	}
}
