package com.example.student_attendance.services;

import com.example.student_attendance.Exceptions.ApiException;
import com.example.student_attendance.models.User;
import com.example.student_attendance.repositories.UserRepository;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.student_attendance.models.LoginResponse;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtService=jwtService;
    }


    //create user
    public User createUser(User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new ApiException("User already exists", 409);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    //get all users 
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    //get user by id
    public User getUserById(Long id){
        User existUser = userRepository.findById(id).orElse(null);

        if(existUser == null){
            throw new ApiException("User not found", 404);
        }

        return existUser;
    }

    //get user by email
    public User getUserByEmail(String email){
        User existUser = userRepository.findByEmail(email).orElse(null);    

        if(existUser == null){
            throw new ApiException("User not found", 404);
        }

        return existUser;
    }


    public LoginResponse login(String email, String password){
        User user = userRepository.findByEmail(email).orElse(null);

        if(user == null){
            throw new ApiException("User not found", 404);
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new ApiException("Wrong password", 401);
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(token, user.getRole());
    }
}
