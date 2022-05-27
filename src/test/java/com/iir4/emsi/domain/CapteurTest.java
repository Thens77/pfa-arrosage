package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CapteurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Capteur.class);
        Capteur capteur1 = new Capteur();
        capteur1.setId(1L);
        Capteur capteur2 = new Capteur();
        capteur2.setId(capteur1.getId());
        assertThat(capteur1).isEqualTo(capteur2);
        capteur2.setId(2L);
        assertThat(capteur1).isNotEqualTo(capteur2);
        capteur1.setId(null);
        assertThat(capteur1).isNotEqualTo(capteur2);
    }
}
