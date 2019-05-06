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

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.cognizant.devops.platformservice.customsettings.CustomAppSettings;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;

public class CrossScriptingFilter implements Filter {
	private static Logger LOG = LogManager.getLogger(CustomAppSettings.class);
	private FilterConfig filterConfig;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
	}

	@Override
	public void destroy() {
		this.filterConfig = null;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		// LOG.info("In doFilter CrossScriptingFilter ...............");

		HttpServletResponse httpResponce = (HttpServletResponse) response;
		try {
			RequestWrapper requestMapper = new RequestWrapper((HttpServletRequest) request,
					httpResponce);
			chain.doFilter(requestMapper, httpResponce);
			// LOG.debug("Completed .. in CrossScriptingFilter");

		} catch (Exception e) {
			LOG.error("Invalid request in CrossScriptingFilter");
			String msg = PlatformServiceUtil.buildFailureResponse("Invalid request").toString();
			httpResponce.setContentType("application/json");
			httpResponce.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			httpResponce.getWriter().write(msg);
			httpResponce.getWriter().flush();
			httpResponce.getWriter().close();
			// e.printStackTrace();
		}
		// LOG.info("Out doFilter CrossScriptingFilter ...............");
	}
}
