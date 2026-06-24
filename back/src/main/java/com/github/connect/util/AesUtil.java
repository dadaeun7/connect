package com.github.connect.util;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AesUtil {
    
    private final String secretKey;
    private final SecureRandom secureRandom = new SecureRandom();
    private static final String ALGORIGHM = "AES/GCM/PKCS5Padding";

    public AesUtil(@Value("${spring.ase.secret-key}") String secretKey){
        this.secretKey = secretKey;
    }

    public String encrypt(String platinText){

        if(platinText == null) return null;

        try{
            byte[] iv = new byte[16];
            secureRandom.nextBytes(iv);
            IvParameterSpec ivSpec = new IvParameterSpec(iv);

            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance(ALGORIGHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivSpec);

            byte[] encryptedBytes = cipher.doFinal(platinText.getBytes(StandardCharsets.UTF_8));

            // [IV 16바이트] + [암호화된 데이터]를 하나로 합침
            byte[] combined = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);

            // 최종 합친 바이트 배열을 Base64로 인코딩해서 DB에 저장
            return Base64.getEncoder().encodeToString(combined);
        }catch(Exception e){
            throw new IllegalStateException("Encryption failed", e);
        }

    }

    public String decrypt(String cipherText){

        if(cipherText == null) return null;

        try{
            byte[] combined = Base64.getDecoder().decode(cipherText);

            byte[] iv = new byte[16];
            System.arraycopy(combined, 0, iv, 0, iv.length);
            IvParameterSpec ivSpec = new IvParameterSpec(iv);

            // 2. 뒤의 나머지 바이트(실제 암호문) 추출
            int encryptedSize = combined.length - iv.length;
            byte[] encryptedBytes = new byte[encryptedSize];
            System.arraycopy(combined, iv.length, encryptedBytes, 0, encryptedSize);

            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance(ALGORIGHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        }catch(Exception e){
            throw new IllegalStateException("Encryption failed", e);
        }
    }
}
