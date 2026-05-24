package com.github.connect;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.github.connect.entity.Users;
import com.github.connect.entity.Users.RoleType;
import com.github.connect.repository.UsersRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
@Slf4j
@SpringBootTest
@ActiveProfiles("test")
class RepositoryTest {

	@Autowired
	private UsersRepository usersRepository;

	@Test
	void testJpa() {

		Users user1 = new Users();
		user1.setEmail("test@gmail.com");
		user1.setExternalId(null);
		user1.setName("테스트1");
		user1.setPassword("Test12#$");
		user1.setJoinType(RoleType.COMPANY);
		
		// when
		Users saveUser = usersRepository.save(user1);

		assertThat(saveUser).isNotNull();

		Users fetchedUser = usersRepository.findById(saveUser.getId()).orElse(null);

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
