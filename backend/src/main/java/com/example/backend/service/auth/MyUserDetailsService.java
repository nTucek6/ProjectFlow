package com.example.backend.service.auth;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MyUserDetailsService implements UserDetailsService {
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User applicationUser = userService.findByEmail(username);
        if (applicationUser == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        return new CustomUserDetails(
                applicationUser.getId(), // <-- user ID here
                applicationUser.getEmail(),
                applicationUser.getPassword(),
                applicationUser.getName(),
                applicationUser.getSurname(),
                List.of(new SimpleGrantedAuthority("ROLE_" + applicationUser.getRole().name()))
        );
        /*
        return org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password(applicationUser.getPassword())
                .roles(applicationUser.getRole().name())
                .build();
                /*
         */
    }
}
