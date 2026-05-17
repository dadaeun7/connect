package com.github.connect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.github.connect.entity.User;
import com.github.connect.entity.User.RoleType;
import com.github.connect.repository.UsersRepository;

import lombok.extern.slf4j.Slf4j;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
class RepositoryTest {

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
		
		// when
		User saveUser = userRepository.save(user1);

		assertThat(saveUser).isNotNull();

		User fetchedUser = userRepository.findById(saveUser.getId()).orElse(null);

		log.info(">>> fetchedUser: {}", fetchedUser);

		assertThat(fetchedUser).isNotNull();
		assertThat(fetchedUser.getEmail()).isEqualTo("test@gmail.com");
		assertThat(fetchedUser.getName()).isEqualTo("테스트1");

		log.info(">>> User Email: {}", fetchedUser.getEmail());
		log.info(">>> User Name: {}", fetchedUser.getName());

		var isGreater = assertThat(saveUser.getId()).isGreaterThan(0);

		log.info(">>> User Auto Id created: {}",isGreater);

	}

}
