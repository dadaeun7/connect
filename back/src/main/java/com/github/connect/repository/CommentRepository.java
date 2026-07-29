package com.github.connect.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.github.connect.entity.Comment;

public interface CommentRepository extends ReactiveCrudRepository<Comment, Long>{
    
}
