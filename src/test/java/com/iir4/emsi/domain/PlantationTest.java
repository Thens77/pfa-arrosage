package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlantationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plantation.class);
        Plantation plantation1 = new Plantation();
        plantation1.setId(1L);
        Plantation plantation2 = new Plantation();
        plantation2.setId(plantation1.getId());
        assertThat(plantation1).isEqualTo(plantation2);
        plantation2.setId(2L);
        assertThat(plantation1).isNotEqualTo(plantation2);
        plantation1.setId(null);
        assertThat(plantation1).isNotEqualTo(plantation2);
    }
}
