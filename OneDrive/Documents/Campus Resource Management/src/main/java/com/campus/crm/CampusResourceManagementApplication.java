package com.campus.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampusResourceManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusResourceManagementApplication.class, args);
	}

}
