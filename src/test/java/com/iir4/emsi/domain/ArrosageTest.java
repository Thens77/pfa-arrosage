package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ArrosageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Arrosage.class);
        Arrosage arrosage1 = new Arrosage();
        arrosage1.setId(1L);
        Arrosage arrosage2 = new Arrosage();
        arrosage2.setId(arrosage1.getId());
        assertThat(arrosage1).isEqualTo(arrosage2);
        arrosage2.setId(2L);
        assertThat(arrosage1).isNotEqualTo(arrosage2);
        arrosage1.setId(null);
        assertThat(arrosage1).isNotEqualTo(arrosage2);
    }
}
