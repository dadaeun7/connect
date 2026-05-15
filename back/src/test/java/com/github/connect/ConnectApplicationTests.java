package com.github.connect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.github.connect.entity.User;
import com.github.connect.entity.User.RoleType;
import com.github.connect.repository.UsersRepository;

@SpringBootTest
class ConnectApplicationTests {

	@Autowired
	private UsersRepository userRepository;

	@Test
	void testJpa() {

		User user1 = new User();
		user1.setEmail("test@gmail.com");
		user1.setExternalId(null);
		user1.setName("테스트1");
		user1.setPassword("Test12#$");
		user1.setType(RoleType.COMPANY);
		
		userRepository.save(user1);

	}

}
