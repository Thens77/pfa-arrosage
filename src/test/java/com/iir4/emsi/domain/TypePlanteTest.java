package com.iir4.emsi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iir4.emsi.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypePlanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypePlante.class);
        TypePlante typePlante1 = new TypePlante();
        typePlante1.setId(1L);
        TypePlante typePlante2 = new TypePlante();
        typePlante2.setId(typePlante1.getId());
        assertThat(typePlante1).isEqualTo(typePlante2);
        typePlante2.setId(2L);
        assertThat(typePlante1).isNotEqualTo(typePlante2);
        typePlante1.setId(null);
        assertThat(typePlante1).isNotEqualTo(typePlante2);
    }
}
