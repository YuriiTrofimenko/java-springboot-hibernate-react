package org.tyaa.demo.springboot.simplespa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.tyaa.demo.springboot.simplespa.dao.RoleHibernateDAO;
import org.tyaa.demo.springboot.simplespa.dao.UserHibernateDAO;
import org.tyaa.demo.springboot.simplespa.entity.Role;
import org.tyaa.demo.springboot.simplespa.entity.User;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;
import org.tyaa.demo.springboot.simplespa.model.RoleModel;
import org.tyaa.demo.springboot.simplespa.model.UserModel;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    public PasswordEncoder passwordEncoder;

    @Autowired
    private RoleHibernateDAO roleDao;

    @Autowired
    private UserHibernateDAO userDao;

    public ResponseModel createRole(RoleModel roleModel) {
        Role role = Role.builder().name(roleModel.name).build();
        roleDao.save(role);
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("%s Role Created", role.getName()))
            .build();
    }

    public ResponseModel createUser(UserModel userModel) {
        User user =
            User.builder()
                .name(userModel.getName().trim())
                .password(passwordEncoder.encode(userModel.getPassword().trim()))
                .role(roleDao.findRoleByName("ROLE_USER"))
                .build();
        userDao.save(user);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("%s User Created", user.getName()))
                .build();
    }

    public ResponseModel getAllRoles() {
        List<Role> roles =
                roleDao.findAll(Sort.by("name").ascending());
        List<RoleModel> roleModels =
            roles.stream()
                .map((r) -> RoleModel.builder()
                    .id(r.getId())
                    .name(r.getName())
                    .build())
                .collect(Collectors.toList());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Role List Retrieved Successfully"))
                .data(roleModels)
                .build();
    }

    @Transactional
    public ResponseModel getRoleUsers(Long roleId) {
        Optional<Role> roleOptional = roleDao.findById(roleId);
        if (roleOptional.isPresent()) {
            Role role = roleOptional.get();
            List<UserModel> userModels =
                role.getUsers().stream().map(user ->
                    UserModel.builder()
                        .name(user.getName())
                        .roleId(user.getRole().getId())
                        .build()
                )
                .collect(Collectors.toList());
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("List of %s Role Users Retrieved Successfully", role.getName()))
                .data(userModels)
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("No Users: Role #%d Not Found", roleId))
                .build();
        }
    }

    public ResponseModel deleteRole(Long id) {
        roleDao.deleteById(id);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message("Role Deleted")
                .build();
    }

    public ResponseModel deleteUser(Long id) {
        userDao.deleteById(id);
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("User #%d Deleted", id))
            .build();
    }

    public ResponseModel check(Authentication authentication) {
        ResponseModel response = new ResponseModel();
        if (authentication != null && authentication.isAuthenticated()) {
            UserModel userModel = UserModel.builder()
                .name(authentication.getName())
                .roleName(
                    authentication.getAuthorities().stream()
                        .findFirst()
                        .get()
                        .getAuthority()
                )
                .build();
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage(String.format("User %s Signed In", userModel.name));
            response.setData(userModel);
        } else {
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage("User is a Guest");
        }
        return response;
    }

    public ResponseModel onSignOut() {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message("Signed out")
            .build();
    }

    public ResponseModel onError() {
        return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message("Auth error")
                .build();
    }

    public ResponseModel makeUserAdmin(Long id) throws Exception {
        // Получаем из БД объект роли администратора
        Role role = roleDao.findRoleByName("ROLE_ADMIN");
        Optional<User> userOptional = userDao.findById(id);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setRole(role);
            userDao.save(user);
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Admin %s created successfully", user.getName()))
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("User #%d Not Found", id))
                .build();
        }
    }
}
