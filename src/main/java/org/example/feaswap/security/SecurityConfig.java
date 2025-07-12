package org.example.feaswap.security;

import lombok.RequiredArgsConstructor;

import org.example.feaswap.service.CustomUserDetailsService;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/user/**","/api/auth/**").permitAll()
                        .requestMatchers("swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/food").permitAll()
                        .requestMatchers(HttpMethod.GET,"/food/{foodItemId}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/food").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/food/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/food/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/food/**").authenticated()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/reviews").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/reports").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/reports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reports").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/messages/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/messages").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/notifications").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/exchangerequests/food/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/exchangerequests/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/exchangerequests/**").authenticated()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
